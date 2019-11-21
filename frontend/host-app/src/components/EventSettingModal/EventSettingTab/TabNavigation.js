import React from "react";
import {Tab, Box, Tabs} from "@material-ui/core";
import {styled} from "@material-ui/core/styles";
import TabContent from "./TabContent";
import GeneralSetting from "./GeneralSetting/GeneralSetting";

const MyContainer = styled(Box)({
	display: "flex",
	flexShrink: 1,
	padding: 0,
});

const CustomTab = styled(Tab)({});

function allyProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export default function TabNavigation() {
	const GENERAL = 1;
	const ADVANCE = 2;
	const [value, setValue] = React.useState(GENERAL);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<MyContainer>
			<Tabs
				orientation="vertical"
				value={value}
				onChange={handleChange}
				aria-label="simple tabs example"
			>
				/
				<CustomTab label="이벤트설정" disabled={true} />
				<CustomTab label="Item One" {...allyProps(0)} />
				<CustomTab label="Item Two" {...allyProps(1)} />
				<CustomTab label="Item Three" {...allyProps(2)} />
			</Tabs>
			{value === GENERAL && (
				<TabContent value={value} index={1}>
					<GeneralSetting />
				</TabContent>
			)}
			{value === ADVANCE && (
				<TabContent value={value} index={2}>
					<GeneralSetting />
				</TabContent>
			)}
		</MyContainer>
	);
}
