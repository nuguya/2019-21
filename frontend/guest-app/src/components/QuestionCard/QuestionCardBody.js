import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import QuestionEditButton from "./QuestionCardEditButton.js";
import {useGuestGlobal} from "../../GuestGlobalProvider.js";

function QuestionBody(props) {
	const {guest} = useGuestGlobal();
	const {content, GuestId} = props;

	const isMyQuestion = guest.id === GuestId;

	return (
		<span>
			<Typography
				color={"textPrimary"}
				variant={"body1"}
			>
				{content}
				{isMyQuestion && <QuestionEditButton {...props} />}
			</Typography>
		</span>
	);
}

QuestionBody.propTypes = {
	content: PropTypes.string,
	isMyQuestion: PropTypes.bool,
};

QuestionBody.defualtProps = {
	content: "",
	isMyQuestion: false,
};

export default QuestionBody;
