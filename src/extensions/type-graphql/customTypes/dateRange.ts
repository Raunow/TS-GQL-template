import { Field, InputType } from 'type-graphql';

@InputType()
export class DateRange {
	@Field({ nullable: true })
	from: string;
	@Field({ nullable: true })
	to: string;
}
