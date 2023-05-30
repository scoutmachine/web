import { useState } from "react";

type BooleanQuestion = {
  id: number;
  type: "boolean";
  description: string;
};

type CounterQuestion = {
  id: number;
  type: "counter";
  description: string;
};

type Question = BooleanQuestion | CounterQuestion;

const questions: Question[] = [
  {
    id: 123,
    type: "boolean",
    description: "Did it climb?",
  },
  {
    id: 456,
    type: "counter",
    description: "High Goals Scored?",
  },
];

const Toggle = ({ value, onChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <input
        type="radio"
        checked={value}
				onChange={() => {
				}}
        onClick={() => {
					onChange(!value)
				}}
      />
    </div>
  );
};

const Counter = ({ value, onChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <button className="w-8 h-8 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
				onClick={() => onChange(value - 1)}
			>
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20 12H4"></path>
        </svg>
      </button>
      <span className="text-gray-700 dark:text-gray-400">{value}</span>
      <button className="w-8 h-8 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800"
				onClick={() => onChange(value + 1)}
			>
        <svg
          className="w-4 h-4 text-gray-600 dark:text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20 12H4"></path>
          <path d="M12 20L12 4"></path>
        </svg>
      </button>
    </div>
  );
};
const QuestionRow = ({ question, value, onChange }: { question: Question, value: any, onChange: Function }) => {
  return (
    <div className="flex bg-blue-400">
      <div className="bg-red-300">{question.description}</div>
      <div className="bg-green-300">
        {question.type === "boolean" ? <Toggle value={value} onChange={onChange}/> : null}
        {question.type === "counter" ? <Counter value={value} onChange={onChange}/> : null}
      </div>
    </div>
  );
};

const getDefaultForm = (questions: Question[]) => {
	const form: Record<number, any> = {}

	for (const question of questions) {
		if (question.type === "boolean") {
			form[question.id] = false
		} else if (question.type === "counter") {
			form[question.id] = 0
		}
	}

	return form
}

export const MatchScout = (props: any) => {
	const [form, setForm] = useState(getDefaultForm(questions))

  return (
    <div className="">
			{JSON.stringify(form)}
      {questions.map((question) => (
        <QuestionRow key={question.id} question={question} value={form[question.id]} onChange={(newVal: any) => {
					setForm({
						...form,
						[question.id]: newVal
					})
				}}/>
      ))}

			<button onClick={() => {
				console.log('form: ', form)
			}}>Submit</button>

    </div>
  );
};
