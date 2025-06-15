import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock AI API responses
export const handlers = [
  // OpenAI API mock
  rest.post('https://api.openai.com/v1/chat/completions', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'chatcmpl-test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'gpt-4',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: 'Mock AI response for testing'
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30
        }
      })
    );
  }),

  // Anthropic API mock
  rest.post('https://api.anthropic.com/v1/messages', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 'msg_test',
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'text',
            text: 'Mock Claude response for testing'
          }
        ],
        model: 'claude-3-sonnet-20240229',
        stop_reason: 'end_turn',
        stop_sequence: null,
        usage: {
          input_tokens: 10,
          output_tokens: 20
        }
      })
    );
  })
];

export const server = setupServer(...handlers);