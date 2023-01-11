import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

export async function runCompletion() {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 'How are you today?',
  });
  console.log(completion.data.choices[0].text);
}
