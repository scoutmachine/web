
type BooleanQuestion = {
	id: number,
	type: 'boolean',
	description: string
}

type CounterQuestion = {
	id: number,
	type: 'counter',
	description: string
}

type Question = BooleanQuestion | CounterQuestion

const questions: Question[] = [
	{
		id: 123,
		type: 'boolean',
		description: 'Did it climb?'
	},
	{
		id: 456,
		type: 'counter',
		description: 'High Goals Scored?'
	}
]

const Toggle = () => {
	return (
		<label className="relative inline-flex items-center cursor-pointer">
		<input type="checkbox" value="" className="sr-only peer"/>
		<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
	</label>	
	)
}

const QuestionRow = ({ question }: { question: Question}) => {
	return (
		<div className="flex bg-blue-400">
			<div className="bg-red-300">
				{question.description}
			</div>
			<div className="bg-green-300">
				{ question.type === 'boolean' ? <Toggle/>: null}
			</div>
		</div>
	)
}

export const MatchScout = (props: any) => {
  return (
    <div className="">
				{questions.map(question => (
					<QuestionRow key={question.id} question={question}/>
				))}
    </div>
  );
};
