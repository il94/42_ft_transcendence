import { Style } from "./style"
import Contact from "./Contact"
import colors from "../../../utils/colors"

function ContactList() {
	return (
		<Style>
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
		</Style>
	)
}

export default ContactList