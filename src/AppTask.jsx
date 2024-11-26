import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import questions from './data/questions.json'

export default function App() {
  let [obtainedPoints, setObtainedPoints] = useState(0);
  let [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  let [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  let [selectedOptions, setSelectedOptions] = useState([]);
  let [showResult, setShowResult] = useState(false);

  const onOptionSelected = (selectedIndex) => {

    setSelectedOptionIndex(selectedIndex);
    if (selectedIndex === questions[currQuestionIndex]?.correctOptionIndex) {
      setObtainedPoints(obtainedPoints + 1);
    }

    setSelectedOptions((prev) => [
      ...prev,
      {
        question: questions[currQuestionIndex]?.statement,
        selected: selectedIndex,
        correct: selectedIndex === questions[currQuestionIndex]?.correctOptionIndex,
        correctOption: questions[currQuestionIndex]?.correctOptionIndex,
        options: questions[currQuestionIndex]?.options,
      },
    ]);
  }

  const restart = () => {
    setObtainedPoints(0);
    setCurrQuestionIndex(0);
    setSelectedOptions([]);
    setShowResult(false);
  }

  const reviewResult = (status) => {
    console.log("Review Result invoked with status:", status);
    setShowResult(status);
  }

  const nextQuestion = () => {
    setSelectedOptionIndex(null);
    setCurrQuestionIndex(currQuestionIndex + 1);
  }

  // // Function to generate and download the file
  const downloadAnswers = () => {
    const fileContent = selectedOptions
      .map((option, index) => {
        const correctAnswer = option.options[option.correctOption];
        const userAnswer = option.options[option.selected];
        return `
          Question ${index + 1}: ${option.question}
          Correct Answer: ${correctAnswer}
          Your Answer: ${userAnswer} ${option.correct ? "(✔)" : "(✘)"}
        `;
      })
      .join('\n\n');

    const blob = new Blob([fileContent], { type: 'text/plain' }); // Create a blob with the file content
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); // Create a temporary link element
    link.href = url;
    link.download = 'quiz-answers.txt'; // Specify the file name
    link.click(); // Trigger the download
    URL.revokeObjectURL(url); // Clean up the URL
  };

  return (
    <>
      {currQuestionIndex === questions.length ?

        <div className="quiz-container">

          <div className='app-header'>
            <h1 style={{ color: 'red' }}>Quiz Finished</h1>
            {obtainedPoints < (questions.length / 2) && <p>Good One. Try Again!</p>}
            {obtainedPoints == questions.length && <p> Well Done!</p>}
            <p>You scored {obtainedPoints} / {questions.length}</p>
          </div>
          <div className='buttons'>
            <button className="quiz-restart-button" onClick={restart}>Restart</button>
            {/* show result reviews*/}
            <button className="quiz-review-button" onClick={() => reviewResult(true)}>Check Result</button>
            {/* download answers*/}
            {<button className="quiz-download-button" onClick={downloadAnswers}>Download Answers</button> } 
          </div>

          {showResult &&
            <div className="quiz-review">
              <h2>Review Answers</h2>
              <ul>
                {selectedOptions.map((option, index) => (
                  <li key={index}>
                    <p>
                      <strong>Q: {index + 1}</strong>
                    </p>
                    <p>
                      Your Answer: {option.options[option.selected]}{' '}
                      {option.correct ? (
                        <span style={{ color: 'green' }}>✔</span>
                      ) : (
                        <span style={{ color: 'red' }}>✘</span>
                      )}
                    </p>
                    {!option.correct && (
                      <strong style={{ color: 'green' }}>
                        Correct Answer: {option.options[option.correctOption]}
                      </strong>
                    )}
                  </li>
                ))}
              <button className="quiz-hide-button" onClick={() => reviewResult(false)}>Hide Result</button>
              </ul> 
            </div>
          }
        </div>
        :
        <div className="quiz-container">

          <div className='app-header'>
            <h1 style={{ color: 'red' }}>Flag Selection Quiz</h1>
            <p>Q #  {currQuestionIndex + 1} out of {questions.length}</p>
          </div>

          <div key={questions[currQuestionIndex]?.id} className="quiz-question-container">
            <h2 className="quiz-question">{questions[currQuestionIndex]?.statement}</h2>
            <img src={questions[currQuestionIndex]?.image} alt={questions[currQuestionIndex]?.id} width={200} style={{ objectFit: 'contain', borderRadius: '4px' }}
            />
            <ul className="quiz-options">
              {questions[currQuestionIndex]?.options?.map((opt, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onOptionSelected(index)
                    setTimeout(() => nextQuestion(), 1000);
                  }}
                  className="quiz-section"
                  style={{
                    backgroundColor: selectedOptionIndex === index ? (index === questions[currQuestionIndex]?.correctOptionIndex ? '#00ab41' : 'red') : ''
                  }}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        </div>

      }
    </>
  )
}





