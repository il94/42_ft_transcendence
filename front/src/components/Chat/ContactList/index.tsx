import { Style } from "./style"
import Contact from "./Contact"
import colors from "../../../utils/colors"

function ContactList() {
	return (
		<Style>
			<Contact color={colors.section} />
			<Contact color={colors.sectionAlt} />
			<Contact color={colors.section} />
			<Contact color={colors.sectionAlt} />
			<Contact color={colors.section} />
			<Contact color={colors.sectionAlt} />
			<Contact color={colors.section} />
			<Contact color={colors.sectionAlt} />
		</Style>
	)
}

export default ContactList