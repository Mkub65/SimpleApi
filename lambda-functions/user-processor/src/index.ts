import { DynamoDBStreamEvent, DynamoDBStreamHandler, DynamoDBRecord } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient();

interface AuditLogEntry {
    userId: string;
    timestamp: string;
    event: string;
    oldValues?: any;
    newValues?: any;
}

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) : Promise<void> => {
    console.log('DynamoDB Stream Event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        try {
            await processRecord(record);
        } catch (error) {
            console.error('Error processing record:', error);
            console.error('Record:', JSON.stringify(record, null, 2));
        }
    }
}

async function processRecord(record: DynamoDBRecord) {
    const eventName = record.eventName;
    const dynamodb = record.dynamodb;

    if (!dynamodb) return;

    let userId: string;

    if (dynamodb.Keys?.userId?.S) {
        userId = dynamodb.Keys.userId.S;
    } else if (dynamodb.NewImage?.userId?.S) {
        userId = dynamodb.NewImage.userId.S;
    } else if (dynamodb.OldImage?.userId?.S) {
        userId = dynamodb.OldImage.userId.S;
    } else {
        console.error('Cannot extract userId from record');
        return;
    }

    const oldValues = dynamodb.OldImage ? DynamoDB.Converter.unmarshall(dynamodb.OldImage as DynamoDB.AttributeMap) : null;
    const newValues = dynamodb.NewImage ? DynamoDB.Converter.unmarshall(dynamodb.NewImage as DynamoDB.AttributeMap) : null;

    let eventDescription: string;
    switch (eventName) {
        case 'INSERT':
            eventDescription = 'User created';
            break;
        case 'MODIFY':
            eventDescription = getModifyDescription(oldValues, newValues);
            break;
        case 'REMOVE':
            eventDescription = 'User deleted';
            break;
        default:
            eventDescription = `Unknown event: ${eventName}`;
    }

    const auditEntry: AuditLogEntry = {
        userId: userId,
        timestamp: new Date().toISOString(),
        event: eventDescription
    };

    if (eventName === 'MODIFY' && oldValues && newValues) {
        auditEntry.oldValues = oldValues;
        auditEntry.newValues = newValues;
    } else if (eventName === 'INSERT' && newValues) {
        auditEntry.newValues = newValues;
    } else if (eventName === 'REMOVE' && oldValues) {
        auditEntry.oldValues = oldValues;
    }

    console.log('Creating audit log entry:', JSON.stringify(auditEntry, null, 2));

    const params = {
        TableName: 'AuditLogTable',
        Item: auditEntry
    };

    await dynamoDb.put(params).promise();
    console.log('Audit log saved successfully');
}

function getModifyDescription(oldValues: any, newValues: any) : string {
    const changedFields: string[] = [];
    
    const fieldsToCheck = ['name', 'role'];
    
    fieldsToCheck.forEach(field => {
        if (oldValues[field] !== newValues[field]) {
            changedFields.push(field);
        }
    });

    if (changedFields.length === 0) {
        return 'User modified (no significant changes)';
    }

    return `User modified - changed fields: ${changedFields.join(', ')}`;
}