import React, {useContext} from "react";
import {useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import PollContainer from "./PollContainer";
import {GuestContext} from "../../libs/guestContext";

const POLL_QUERY = gql`
	query PollGuest($EventId: ID!, $guestId: ID!) {
		pollGuest(EventId: $EventId, guestId: $guestId) {
			id
			pollName
			pollType
			selectionType
			allowDuplication
			state
			totalVoters
			pollDate
			nItems {
				id
				number
				content
				voters
				voted
				firstPlace
			}
		}
	}
`;

function PollApollo() {
	const {event, guest} = useContext(GuestContext);
	const options = {
		variables: {
			EventId: event.id,
			guestId: guest.id,
		},
	};
	const {loading, error, data} = useQuery(POLL_QUERY, options);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;

	return <PollContainer data={data.pollGuest} />;
}

export default PollApollo;
