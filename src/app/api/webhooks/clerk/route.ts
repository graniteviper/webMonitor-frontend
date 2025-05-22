import { verifyWebhook } from '@clerk/nextjs/webhooks'

export async function POST(req: Request) {
  try {
    console.log("hi");
    
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return Response.json({
      message: "SUpp"
    })
    // return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return Response.json({
      message: "SUpp"
    })
    // return new Response('Error verifying webhook', { status: 400 })
  } 
}

// export async function GET(req: Request){
//   return Response.json({
//     message: "hi there"
//   })
// }