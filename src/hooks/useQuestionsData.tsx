import confetti from 'canvas-confetti'
import { useQuestionsStore } from '../store/questions'

export const useQuestionsData = () => {
  const questions = useQuestionsStore(state => state.questions)

  let correct = 0
  let incorrect = 0
  let unanswered = 0

  questions.forEach(question => {
    const { userSelectedAnswer, correctAnswer } = question
    if (userSelectedAnswer == null) unanswered++
    else if (userSelectedAnswer === correctAnswer) correct++
    else incorrect++
  })

  //handle all questions answered
  if (unanswered === 0 && questions.length > 0 && correct > incorrect) {
    for (let i = 0; i < 10; i++) {
     setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2
        }
      })
      }, i * 1000)
    }
  }
  return { correct, incorrect, unanswered }
}