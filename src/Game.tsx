import { Button, Card, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import { useQuestionsStore } from './store/questions';
import { type Question as QuestionType } from './types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Footer } from './Footer';

const getBackgroundColor = (info: QuestionType, index: number) => {
    const { userSelectedAnswer, correctAnswer } = info
    // usuario no ha seleccionado nada todavía
    if (userSelectedAnswer == null) return 'transparent'
    // si ya selecciono pero la solución es incorrecta
    if (index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'
    // si esta es la solución correcta
    if (index === correctAnswer) return 'green'
    // si esta es la selección del usuario pero no es correcta
    if (index === userSelectedAnswer) return 'red'
    // si no es ninguna de las anteriores
    return 'transparent'
}


const Question = ({ info }: { info: QuestionType }) => {
    const selectAnswer = useQuestionsStore((state) => state.selectAnswer)
    const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion)
    const createHandleClick = (answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex)
    }

    //handle if answer is selected or not in actual question for a display of next button
    const handleAnswered = () => {
        if (info.userSelectedAnswer !== undefined) return 'block'
        return 'none'
    }



    return (
        <Card variant='outlined' sx={{ textAlign: 'left', p: 2, mt: 4 }}>
            <Typography variant='h5'>
                {info.question}
            </Typography>

            <Stack sx={{ position: "relative" }}>
                <SyntaxHighlighter showLineNumbers language='javascript' style={tomorrowNight}>
                    {info.code + "\n"}
                </SyntaxHighlighter>
                <Button onClick={goNextQuestion} sx={{ display: handleAnswered, color: 'white',backgroundColor:"#1c7cd7", position: "absolute", right: "2px", bottom: "18px" }}>
                    SIGUIENTE
                </Button>
            </Stack>
            <List disablePadding>
                {info.answers.map((answer, index) => (
                    <ListItem key={index} sx={{ bgcolor: "#333" }} disablePadding divider>
                        <ListItemButton disabled={info.userSelectedAnswer != null} onClick={createHandleClick(index)} sx={{ backgroundColor: getBackgroundColor(info, index) }}>
                            <ListItemText primary={answer} sx={{ textAlign: 'center', fontWeight: "bold" }} />
                        </ListItemButton>

                    </ListItem>

                ))}
            </List>
        </Card>
    )
}
export const Game = () => {
    const questions = useQuestionsStore((state) => state.questions)
    const currentQuestion = useQuestionsStore((state) => state.currentQuestion)

    const goNextQuestion = useQuestionsStore((state) => state.goNextQuestion)
    const goPreviousQuestion = useQuestionsStore((state) => state.goPreviousQuestion)

    const questionInfo = questions[currentQuestion]

    return (
        <>
            <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
                <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0} sx={{ color: 'white' }}>
                    <ArrowBackIosNew />
                </IconButton>
                <Typography variant='h5'>
                    {currentQuestion + 1} / {questions.length}
                </Typography>
                <IconButton onClick={goNextQuestion} disabled={currentQuestion === questions.length - 1} sx={{ color: 'white' }}>
                    {/* <ArrowBackIosNew sx={{ transform: 'rotate(180deg)' }} /> */}
                    <ArrowForwardIos />
                </IconButton>

            </Stack>
            <Question info={questionInfo} />
            <Footer />
        </>
    )
}