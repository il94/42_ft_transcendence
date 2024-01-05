import { Relations, RelationStatus, RequestStatus } from "@prisma/client"
import { IsNotEmpty } from "class-validator";

export class RelationDto implements Relations {
	
	id: number;
	createdAt: Date;

	@IsNotEmpty()
	RelationType: RelationStatus;

	request: RequestStatus;

	hasRelationsId: number;
	isInRelationsId: number;

}

