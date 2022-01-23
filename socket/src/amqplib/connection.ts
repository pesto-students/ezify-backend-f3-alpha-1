import amqplib from "amqplib";

const MESSAGE_URL = "amqps://ipiqebxu:OrasXq_cICWMLsdaxW3gIgNEaTW5d6UH@puffin.rmq2.cloudamqp.com/ipiqebxu";

const EXCHANGE_name = "EZZIFY";


export const createChannel = async() => {

    try {
        
        const connection = await amqplib.connect(MESSAGE_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_name, "direct", {durable:false});
        

        return channel;
    } catch (err:any) {
            console.log({err});
            
    }
    
};

export const publishMessage = async(channel:any, binding_key:any, message:any) => {

    try {
        await channel.publish(EXCHANGE_name, binding_key, Buffer.from(message));
    } catch (err:any) {
        console.log(err);
        
    }
};

export const subscribeMessage = async(channel:amqplib.Channel | undefined, binding_key:string, service:any) => {
    try {

        const appQueue = await channel?.assertQueue("booking_queue") ;
        const queue :string =(appQueue as  amqplib.Replies.AssertQueue).queue
        channel?.bindQueue(queue, EXCHANGE_name, binding_key);
        channel?.consume(queue, (data:any) => {
            channel.ack(data);
            const order = data.content.toString();
              service(order);
            
        })
        
    } catch (err:any) {
        console.log({err});
        
    }
};