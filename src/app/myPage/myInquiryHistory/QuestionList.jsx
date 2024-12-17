
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const QuestionList = ({ questions }) => {
  return (
    <div>
      {questions.map((question) => (
        <Accordion key={question.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" width="100%">{question.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">{question.content}</Typography>
            {question.answer && (
              <Typography variant="body2" color="textSecondary">
                답변: {question.answer}
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default QuestionList;