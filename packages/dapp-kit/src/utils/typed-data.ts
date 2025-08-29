import type { TypedDataMessage } from '../types';

/**
 *
 * @param types Available types
 * @returns The primary type
 */
export const getPrimaryType = (types: TypedDataMessage['types']) => {
    // Link struct types to their direct child structs
    const links: Record<string, Record<string, boolean>> = {};

    // Link structs to structs which contain them as a child
    const parents: Record<string, Array<string>> = {};

    // Link all subtypes within a given struct
    const subtypes: Record<string, Record<string, boolean>> = {};

    Object.keys(types).forEach((type) => {
        links[type] = {};
        parents[type] = [];
        subtypes[type] = {};
    });

    for (const name in types) {
        const uniqueNames: Record<string, boolean> = {};

        types[name].forEach((field) => {
            // Check each field has a unique name
            if (uniqueNames[field.name]) {
                throw new Error(
                    `Duplicate variable name ${JSON.stringify(field.name)} in ${JSON.stringify(name)}`,
                );
            }
            uniqueNames[field.name] = true;

            // Get the base type (drop any array specifiers)
            const baseType = field.type.match(/^([^\x5b]*)(\x5b|$)/)?.[1];
            if (!baseType) throw new Error(`Base type ${baseType} not found.`);
            if (baseType === name) {
                throw new Error(
                    `Circular type reference to ${JSON.stringify(baseType)}`,
                );
            }

            if (hasBaseEncoder(baseType)) return;

            if (!parents[baseType]) {
                throw new Error(`Unknown type ${JSON.stringify(baseType)}`);
            }

            // Add linkage
            parents[baseType].push(name);
            links[name][baseType] = true;
        });
    }

    // Deduce the primary type
    const primaryTypes = Object.keys(parents).filter(
        (n) => parents[n].length === 0,
    );

    if (primaryTypes.length === 0) throw new Error('Missing primary type');
    if (primaryTypes.length > 1)
        throw new Error('Multiple primary types or ambiguous primary types');
    return primaryTypes[0];
};

const hasBaseEncoder = (type: string) => {
    // intXX and uintXX
    {
        const match = type.match(/^(u?)int(\d*)$/);
        if (match) {
            const width = parseInt(match[2] || '256');
            if (
                width % 8 !== 0 ||
                width > 256 ||
                (match[2] && match[2] !== String(width))
            ) {
                throw new Error(`Invalid numeric width for ${type}`);
            }

            return true;
        }
    }

    // bytesXX
    {
        const match = type.match(/^bytes(\d+)$/);
        if (match) {
            const width = parseInt(match[1]);
            if (width === 0 || width > 32 || match[1] !== String(width)) {
                throw new Error(`Invalid bytes width for ${type}`);
            }

            return true;
        }
    }

    switch (type) {
        case 'address':
            return true;
        case 'bool':
            return true;
        case 'bytes':
            return true;
        case 'string':
            return true;
    }

    return false;
};
