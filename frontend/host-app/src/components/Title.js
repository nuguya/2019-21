import React from "react";
import SwitchTitle from "./SwitchTitle";
import RadioTitle from "./RadioTitle";

function Title({type, state, stateHandler}) {
	switch (type) {
		case "moderation" : return <SwitchTitle titleName="질문 검열"/>;
		case "newQuestion": return <RadioTitle titleName="최신 질문" state= {state} stateHandler={stateHandler} idx={0}/>;
		case "popularQuestion": return <RadioTitle titleName="인기 질문" state= {state} stateHandler={stateHandler} idx={1}/>;
		case "completeQuestion": return <RadioTitle titleName="완료 질문" state= {state} stateHandler={stateHandler} idx={2}/>;
		case "poll": return <RadioTitle titleName="투표" state= {state} stateHandler={stateHandler} idx={3}/>;
		default: return <React.Fragment>{"wrongInput"}</React.Fragment>;
	}
}

export default Title;
