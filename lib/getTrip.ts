export type ItineraryItem = {
  name: string;
  description: string;
  distanceToNext: string;
};
type TripResponse = {
  tripDescription: string;
  itinerary: ItineraryItem[];
  state: 'success' | 'error';
  msg: any;
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
  try {
    const res = await fetch(
      `http://localhost:3000/api/get-trip?country=${country}&travelStyle=${travelStyle}&age=${age}&duration=${duration}`
    );
    const data: TripResponse = await res.json();
    return {
      tripDescription: data?.tripDescription,
      itinerary: data?.itinerary,
      state: data.state,
      msg: data.msg,
    };
  } catch (e) {
    console.error(e);
    return {
      tripDescription: null,
      itinerary: null,
      state: 'error',
      msg: e,
    };
  }
}
