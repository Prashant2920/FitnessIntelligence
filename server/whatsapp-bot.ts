import twilio from 'twilio';
import schedule from 'node-schedule';
import { storage } from './storage';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

// Schedule daily check-ins
export function scheduleDailyCheckIn(userId: number, phoneNumber: string, checkInTime: string) {
  // Format: "HH:mm" (24-hour format)
  const [hours, minutes] = checkInTime.split(':');
  
  const job = schedule.scheduleJob(`${minutes} ${hours} * * *`, async () => {
    await sendDailyCheckIn(phoneNumber);
  });

  return job;
}

// Send initial check-in message
async function sendDailyCheckIn(to: string) {
  try {
    await client.messages.create({
      body: `Hi! Time for your daily fitness check-in 💪\n\nPlease reply with:\n1️⃣ Did you workout today?\n2️⃣ What meals did you have?\n3️⃣ How are you feeling?`,
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Handle incoming messages
export async function handleWhatsAppMessage(message: {
  From: string;
  Body: string;
  ProfileName?: string;
}) {
  try {
    const { From: from, Body: body } = message;
    const userPhone = from.replace('whatsapp:', '');
    
    // Simple conversation flow based on numbered responses
    if (body.toLowerCase().includes('1')) {
      await client.messages.create({
        body: 'Great! What type of workout did you do today? (e.g., cardio, strength, yoga)',
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: from
      });
    } else if (body.toLowerCase().includes('2')) {
      await client.messages.create({
        body: 'Please list your meals for today:\n- Breakfast\n- Lunch\n- Dinner\n- Snacks',
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: from
      });
    } else if (body.toLowerCase().includes('3')) {
      await client.messages.create({
        body: 'How would you rate your energy levels today? (1-5)',
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: from
      });
    } else {
      // Store the response in the database for AI analysis
      // This is a simplified version - you'll want to implement proper conversation state tracking
      await storage.createUserLog({
        userId: await getUserIdFromPhone(userPhone),
        type: 'whatsapp_response',
        content: body,
        timestamp: new Date().toISOString()
      });

      await client.messages.create({
        body: 'Thanks for sharing! Your response has been recorded. Keep up the great work! 💪',
        from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        to: from
      });
    }
  } catch (error) {
    console.error('Error handling WhatsApp message:', error);
  }
}

// Utility function to get userId from phone number
async function getUserIdFromPhone(phone: string): Promise<number> {
  const user = await storage.getUserByPhone(phone);
  if (!user) {
    throw new Error('User not found');
  }
  return user.id;
}

// Send notification about new workout plan
export async function notifyNewWorkoutPlan(to: string, planDetails: any) {
  try {
    const message = `🎉 New Workout Plan Generated!\n\nHere's your workout for today:\n${planDetails.exercises.map((ex: any) => 
      `\n- ${ex.name}: ${ex.sets} sets × ${ex.reps} reps`
    ).join('')}\n\nReady to crush it? 💪`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
  } catch (error) {
    console.error('Error sending workout notification:', error);
  }
}

// Send weekly progress summary
export async function sendWeeklyProgress(to: string, progress: any) {
  try {
    const message = `📊 Weekly Progress Summary\n\nWorkouts completed: ${progress.workoutsCompleted}\nAverage daily calories: ${progress.avgCalories}\nTop achievement: ${progress.topAchievement}\n\nKeep pushing! 🎯`;

    await client.messages.create({
      body: message,
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
  } catch (error) {
    console.error('Error sending progress summary:', error);
  }
}
