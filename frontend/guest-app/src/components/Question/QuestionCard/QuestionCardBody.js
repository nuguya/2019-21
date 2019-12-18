import React, {useContext} from "react";
import PropTypes from "prop-types";
import QuestionEditButton from "./QuestionCardEditButton.js";
import {GuestGlobalContext} from "../../../libs/guestGlobalContext.js";
import {Typography} from "@material-ui/core";

function QuestionBody(props) {
	const {guest} = useContext(GuestGlobalContext);
	const {content, GuestId} = props;

	const isMyQuestion = guest.id === GuestId;

	return (
		<span>
			<Typography
				color={"textPrimary"}
				variant={"subtitle1"}
				style={{fontWeight: "bold"}}
			>
				{content}
			</Typography>
			{isMyQuestion && <QuestionEditButton {...props} />}
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
