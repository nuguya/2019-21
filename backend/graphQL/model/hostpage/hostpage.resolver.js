import faker from "faker";
import {
	getEventsByHostId,
	createEvent,
	getAllEvents,
	updateEventById,
	getEventOptionByEventId,
} from "../../../DB/queries/event.js";
import {createHashtag} from "../../../DB/queries/hashtag.js";

const moderationResolver = async (eventId, moderationOption) => {
	const updatedEvent = await updateEventById(eventId, {moderationOption});

	return updatedEvent[0];
};

const getEventOptionResolver = async eventId => {
	const evnetOption = await getEventOptionByEventId(eventId);

	return evnetOption;
};

export default {
	Query: {
		init: async (_, {param}, authority) => {
			if (authority.sub === "host") {
				const host = authority.info;
				const events = await getEventsByHostId(host.id);

				return {events, host};
			}

			throw new Error("AuthenticationError");
		},
		getEventOption: async (_, {EventId}) => getEventOptionResolver(EventId),
	},
	Mutation: {
		createHashTags: async (_, {hashTags}, authority) => {
			for (let hashTag of hashTags) {
				await createHashtag({
					name: hashTag.name,
					EventId: hashTag.EventId,
				});
			}
		},
		createEvent: async (_, {info}, authority) => {
			if (authority.sub === "host") {
				let eventCode = faker.random.alphaNumeric(4);
				const events = await getAllEvents();
				const existCode = events.map(event => event.eventCode);

				while (true) {
					const exist = existCode.some(
						someCode => eventCode === someCode
					);

					if (!exist) break;
					eventCode = faker.random.alphaNumeric(4);
				}
				let event = await createEvent({
					eventName: info.eventName,
					eventCode,
					HostId: authority.info.id,
					startAt: info.startAt,
					endAt: info.endAt,
				});

				event = event[0].dataValues;
				return {...event};
			}
			throw new Error("AuthenticationError");
		},
		moderation: (_, {eventId, moderationOption}) =>
			moderationResolver(eventId, moderationOption),
	},
};
