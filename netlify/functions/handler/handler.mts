import type { Config } from '@netlify/functions';

export default async (req: Request) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://ps2devhub.vercel.app/',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight response' }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { next_run } = await req.json();
  console.log('Received event! Next invocation at:', next_run);

  return {
    statusCode: 200,
    headers,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    body: JSON.stringify({ message: 'Event received', next_run }),
  };
};

export const config: Config = {
  schedule: '@hourly',
};
