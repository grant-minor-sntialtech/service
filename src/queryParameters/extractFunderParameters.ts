import { ajv } from '../ajv';
import { InputValidationError } from '../errors';
import { shortCodeSchema } from '../types';
import type { JSONSchemaType } from 'ajv';
import type { Request } from 'express';
import type { ShortCode } from '../types';

interface FunderParameters {
	funderShortCode: ShortCode | undefined;
}

interface FunderParametersQuery {
	funder: ShortCode | undefined;
}

const funderParametersQuerySchema: JSONSchemaType<FunderParametersQuery> = {
	type: 'object',
	properties: {
		funder: {
			...shortCodeSchema,
			nullable: true,
		},
	},
	required: [],
};

const isFunderParametersQuery = ajv.compile(funderParametersQuerySchema);

const extractFunderParameters = (request: Request): FunderParameters => {
	const {
		query: { funder },
	} = request;
	if (funder !== undefined && typeof funder !== 'string') {
		throw new InputValidationError('Invalid funder parameters.', []);
	}
	const candidate: FunderParametersQuery = { funder };
	if (!isFunderParametersQuery(candidate)) {
		throw new InputValidationError(
			'Invalid funder parameters.',
			isFunderParametersQuery.errors ?? [],
		);
	}
	return {
		funderShortCode: candidate.funder,
	};
};

export { extractFunderParameters };
