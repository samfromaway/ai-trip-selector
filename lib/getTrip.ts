import { Configuration, OpenAIApi } from 'openai';

export type ItineraryItem = { name: string; description: string };
type TripResponse = { tripDescription: string; itinerary: ItineraryItem[] };

const configuration = new Configuration({
  apiKey: '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',
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
Then format your result like this:
DayNr: City name - description |.`;
};

const formatTextResponse = (formatTextResponse: string) => {
  return formatTextResponse.split('|');
};

const makeItinerary = (itineraryResponse: string) => {
  const result = itineraryResponse.split('-');
  return { name: result?.[0]?.trim(), description: result?.[1]?.trim() };
};

export async function getTrip({
  country,
  travelStyle,
  age,
  duration,
}: {
  country: string;
  travelStyle: string;
  age: string;
  duration: string;
}): Promise<TripResponse> {
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

  const itinerary = text.map((e) => makeItinerary(e));
  const cleaneditinerary = itinerary.filter((e) => !!e.name);

  return { tripDescription: 'text[0]', itinerary: cleaneditinerary };
}
