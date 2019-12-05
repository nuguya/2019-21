import React, { useState, useReducer } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import PollCard from "./PollCard";
import NewPollModal from "./NewPollModal";
import useModal from "../../customhook/useModal";
import { useSocket } from "../../libs/socket.io-Client-wrapper";

// import PollDummyData from "./PollDummyData";

const ColumnWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	box-sizing: border-box;
	border: 1px solid #dee2e6; /* Gray3 */
	padding: 1rem;
	width: 100%;
`;

// 복수선택이 아닌 투표의 경우, 다른 선택된 항목을 uncheck 하는 함수
const uncheckOtherItems = items => {
	items.forEach(item => {
		if (item.voted) {
			item.voted = false;
			item.voters--;
		}
	});
};

// N지선다형 투표에서 CLICK 으로 인해 상태 변화가 발생한 경우 처리하는 함수
const updateItems = (items, id, allowDuplication) => {
	const newItems = [...items];

	if (newItems[id].voted) {
		newItems[id].voted = false;
		newItems[id].voters--;
	} else {
		if (!allowDuplication) {
			uncheckOtherItems(newItems);
		}
		newItems[id].voted = true;
		newItems[id].voters++;
	}
	return newItems;
};

// 별점 투표는 목록이 1개 이므로 항상 index가 0 임
const updateRatingItem = (items, value, voted) => {
	const newItems = [...items];

	newItems[0].value = value;
	newItems[0].voted = voted;
	return newItems;
};

// 투표의 참여 총인원수를 계산하는 함수 (복수선택 고려함)
const updateTotalVoters = (notVoted, totalVoters, items) => {
	let result = totalVoters;

	if (notVoted) {
		if (items.some(item => item.voted)) {
			result = totalVoters + 1;
		}
	} else if (items.every(item => item.voted === false)) {
		result = totalVoters - 1;
	}

	return result;
};

function reducer(state, action) {
	const notVoted = state.nItems.every(item => item.voted === false);

	switch (action.type) {
		case "VOTE":
			return {
				...state,
				nItems: updateItems(
					state.nItems,
					action.id,
					state.allowDuplication,
				),
				totalVoters: updateTotalVoters(
					notVoted,
					state.totalVoters,
					state.nItems,
				),
			};
		case "RATE":
			return {
				...state,
				nItems: updateRatingItem(state.nItems, action.value, true),
				totalVoters: updateTotalVoters(
					notVoted,
					state.totalVoters,
					state.nItems,
				),
			};
		case "CANCEL_RATING":
			// 이전 상태도 투표하지 않은 상태라면 서버에 요청을 보내지 않도록 처리하는 루틴
			if (notVoted && state.nItems[0].value === 0) {
				return state;
			}
			return {
				...state,
				nItems: updateRatingItem(state.nItems, 0, false),
				totalVoters: updateTotalVoters(
					notVoted,
					state.totalVoters,
					state.nItems,
				),
			};
		default:
			throw new Error("Unhandled action.");
	}
}

function PollContainer({ data }) {
	const [createPollModalOpen, handleOpen, handleClose] = useModal();

	let activePollData = null;
	let sbPollData = null;
	let closedPollData = null;

	if (data) {
		const initialPollData = data;

		activePollData = initialPollData.filter(
			poll => poll.state === "running",
		)[0];
		sbPollData = initialPollData.filter(poll => poll.state === "standby");
		closedPollData = initialPollData.filter(
			poll => poll.state === "closed",
		);
	}

	const [pollData, dispatch] = useReducer(reducer, activePollData);
	const [standbyPollData, setStandbyPollData] = useState(sbPollData);

	// socket.io server 통신 부분
	// onCreatePoll에 의해 신규로 생성된 Poll은 DB에 socket.io server에 요청하여 DB에 write 함
	useSocket("poll/create", req => {
		console.log("useSocket: Poll created. Please refresh.", req);
		// console.log(standbyPollData);
		// setStandbyPollData(standbyPollData.concat(req));
	});

	const onVote = (id, state) => {
		if (state !== "running") return;

		dispatch({
			type: "VOTE",
			id,
		});
	};

	const onChange = (value, state) => {
		if (state !== "running") return;

		dispatch({
			type: "RATE",
			value,
		});
	};

	const onCancelRating = () => {
		dispatch({
			type: "CANCEL_RATING",
		});
	};

	return (
		<ColumnWrapper>
			<Button
				color="primary"
				variant="contained"
				size="large"
				fullWidth
				onClick={handleOpen}
			>
				투표만들기
			</Button>
			{pollData && (
				<PollCard
					{...pollData}
					onVote={onVote}
					onChange={onChange}
					onCancelRating={onCancelRating}
				/>
			)}
			{standbyPollData &&
				standbyPollData.map((poll, index) => (
					<PollCard {...poll} key={index} onVote={onVote} standby />
				))}
			{closedPollData &&
				closedPollData.map((poll, index) => (
					<PollCard {...poll} key={index} onVote={onVote} />
				))}
			{createPollModalOpen && (
				<NewPollModal
					open={createPollModalOpen}
					handleClose={handleClose}
				/>
			)}
		</ColumnWrapper>
	);
}

export default PollContainer;
