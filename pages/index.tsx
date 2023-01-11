import Head from 'next/head';
import { useState } from 'react';
import { getTrip, ItineraryItem } from '../lib/getTrip';
import styles from '../styles/Home.module.css';

const countryOptions = [
  '',
  'Italy',
  'China',
  'Peru',
  'Colombia',
  'Ecuador',
  'Galapagos',
  'Greenland',
];
const travelStyleOptions = ['', 'Active', 'Comfort'];

const Dropdown = ({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  label: string;
  onChange;
}) => {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <label htmlFor={label}>{label}</label>
      <div style={{ padding: 3 }} />
      <select
        id={label}
        value={value}
        onChange={onChange}
        style={{
          display: 'block',
          padding: '10px 12px 10px 12px',
          borderRadius: '8px',
          border: 'none',
          width: '100%',
        }}
      >
        {options.map((e) => (
          <option value={e} key={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
};

const Input = ({
  value,
  onChange,
  label,
  max,
  min,
}: {
  value: string;
  onChange;
  label: string;
  max: number;
  min: number;
}) => {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <label htmlFor={label}>{label}</label>
      <div style={{ padding: 3 }} />
      <input
        type="number"
        max={max}
        min={min}
        id={label}
        value={value}
        onChange={onChange}
        style={{
          display: 'block',
          padding: '10px 12px 10px 12px',
          borderRadius: '8px',
          border: 'none',
          width: '100%',
        }}
      />
    </div>
  );
};

const Spacer = () => {
  return <div style={{ padding: 10 }} />;
};

export default function Home() {
  const [country, setCountry] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [tripDescription, setTripDescription] = useState('');
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [queryState, setQueryState] = useState<
    'error' | 'loading' | 'success' | 'none'
  >('none');

  const handleButtonClick = async () => {
    if (!country || !travelStyle || !duration || !age) {
      alert('fill out all fields');
      return;
    }
    setQueryState('loading');
    const res = await getTrip({ country, travelStyle, age, duration });

    if (res.state === 'error') {
      setQueryState('error');
      console.error(res.msg);

      return;
    }
    if (res) {
      setQueryState('success');
      setTripDescription(res.tripDescription || '');
      setItinerary(res.itinerary || []);
      return;
    }
    setQueryState('error');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Trip Selector</title>
        <meta name="description" content="Trip Selector" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} style={{ maxWidth: 600, margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: 50, margin: 0 }}>
          Choose a trip
        </h1>
        <Spacer />
        <Input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          label={'Age'}
          min={18}
          max={80}
        />

        <Spacer />
        <Input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          label={'Duration of trip'}
          min={2}
          max={6}
        />

        <Spacer />
        <Dropdown
          options={countryOptions}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          label="Destination"
        />
        <Spacer />

        <Dropdown
          options={travelStyleOptions}
          value={travelStyle}
          onChange={(e) => setTravelStyle(e.target.value)}
          label="Travel Style"
        />
        <Spacer />
        <Spacer />
        <button
          onClick={handleButtonClick}
          style={{ padding: '10px 10px 10px 10px', borderRadius: '8px' }}
        >
          Get trip
        </button>
        {queryState === 'error' && <p>Error...</p>}
        {queryState === 'loading' && <p>Loading...</p>}
        {queryState === 'success' && (
          <div>
            <div>
              <h2>Trip Description</h2>
              <p>{tripDescription}</p>
            </div>
            <Spacer />
            <div>
              <h2>Itinerary</h2>
              {itinerary.map((e) => (
                <div key={e.name}>
                  <h6>{e.name}</h6>
                  <p>
                    <span style={{ color: 'grey' }}>
                      Distance to next place:
                    </span>{' '}
                    {e.distanceToNext}
                  </p>
                  <p>
                    <span
                      style={{ color: 'grey', textTransform: 'capitalize' }}
                    >
                      Travel Type:
                    </span>{' '}
                    {e.bestWayToTravel}
                  </p>
                  <p>
                    <span style={{ color: 'grey' }}>Description:</span>{' '}
                    {e.description}
                  </p>
                  <div style={{ padding: 8 }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
