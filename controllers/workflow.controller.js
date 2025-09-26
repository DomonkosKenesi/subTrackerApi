import dayjs from 'dayjs'

//These two line are needed to create the require function so i can read in the serve function of upstash
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
//This is not an import because it is an esm module so import not works on them
const { serve } = require('@upstash/workflow/express')

import Subscription from '../models/subscription.model.js'

const REMINDERS = [7, 5, 3, 1]

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name gmail')
  })
}

//This function is a sleep function until it reaches a date
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`)
  await context.sleepUntil(label, date.toDate())
}

//This is the reminder trigger function for sending an gmail
const triggerReminder = async (context, label) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`)
  })
}

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload
  const subscription = await fetchSubscription(context, subscriptionId)

  //If subscription is noçn existant or the set status is not active than return[exit the function]
  if(!subscription || subscription.status != 'active') return

  const renewalDate = dayjs(subscription.renewalDate)

  if(renewalDate.isBefore(dayjs())){
    console.log(`Renewal date has passed for the subscription ${subscriptionId}, ${subscription.name}`)
    return
  }

  //This is the same is for i in lista from python but in js for .. in ... is used only for objects and dictionaries
  for(const daysBefore of REMINDERS){
    const reminderDate = renewalDate.subtract(daysBefore, 'day')
    
    if(reminderDate.isAfter(dayjs())){
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before `, reminderDate)
    }

    await triggerReminder(context, `Reminder ${daysBefore} days before`)
  }

})

