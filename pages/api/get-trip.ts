import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

const makePromt = ({
  country,
  travelStyle,
  age,
  duration,
}: {
  country: string;
  travelStyle: string;
  age: string;
  duration: string;
}) => {
  return `our client which is ${age} years old, wants to travel to ${country}.
Our client wants to travel in a ${travelStyle} manner.
Create a numbered itinerary for ${duration} days, with a convincing description less than 40 words in the "you" form.
The destinations should be ordered by distance apart from each other.
Then format your result like this:
DayNr: City name (distance to next city in the itinerary in kilo meters)[best way to travel] - description |.

then summarize the itinerary in a convincing enthusiastic text with less than 60 words.
Prefix the itinerary-text with "Description" and add it to the end of the text.
`;
};

const formatTextResponse = (formatTextResponse: string) => {
  const seperatedText = formatTextResponse.split('Description:');

  const itineraryArray = seperatedText?.[0]?.split('|');
  const description = seperatedText?.[1];

  return { description, itineraryArray };
};

const makeItinerary = (itineraryResponse: string) => {
  const result = itineraryResponse.split('-');

  const nameResult = result?.[0]?.trim();
  const name = nameResult.split('(')?.[0]?.split('[')?.[0];
  const distanceToNext = nameResult
    .split('(')?.[1]
    ?.replace(')', '')
    ?.trim()
    ?.split('[')?.[0]
    ?.trim();
  const bestWayToTravel = nameResult.split('[')?.[1]?.replace(']', '')?.trim();

  return {
    name,
    description: result?.[1]?.trim(),
    distanceToNext,
    bestWayToTravel,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { country, travelStyle, age, duration } = req.query;
  if (typeof country !== 'string') return;
  if (typeof age !== 'string') return;
  if (typeof travelStyle !== 'string') return;
  if (typeof duration !== 'string') return;

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      max_tokens: 200,
      prompt: makePromt({
        country,
        travelStyle,
        age,
        duration,
      }),
    });
    const textResponse = completion.data.choices[0].text;

    const text = formatTextResponse(textResponse);

    const itinerary = text?.itineraryArray.map((e) => makeItinerary(e));
    const cleaneditinerary = itinerary.filter((e) => !!e.name);

    res.status(200).json({
      tripDescription: text?.description,
      itinerary: cleaneditinerary,
      state: 'success',
      msg: 'success',
    });
  } catch (error) {
    res.status(500).json({
      tripDescription: null,
      itinerary: null,
      state: 'error',
      msg: error,
    });
  }
}
