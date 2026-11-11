/**
 * Shared by courses json generator and app, so file must not import anything.
 */

export type RosterAttributeValueGroup = {
  readonly attrDescr: string;
  readonly crseAttrValues: string;
};

/**
 * Starting FA25, the roster API leaves catalogDistr, catalogCourseSubfield and catalogAttribute
 * null and reports them in crseAttrValueGroups instead, under the attrDescr 'Distribution
 * Requirements', 'Program Requirements' and 'Exploratory Studies' respectively.
 * @returns the values of all groups named `attrDescr` joined together, e.g. "(SBA-AG), (SSC-AS)",
 * or undefined if there are none.
 */
export const getAttributeGroupValues = (
  crseAttrValueGroups: readonly RosterAttributeValueGroup[] | null | undefined,
  attrDescr: string
): string | undefined =>
  crseAttrValueGroups
    ?.filter(group => group.attrDescr === attrDescr)
    .map(group => group.crseAttrValues)
    .join(', ') || undefined;

/** @returns the course's distribution string, or undefined if it has none. */
export const getCourseDistributionString = ({
  catalogDistr,
  crseAttrValueGroups,
}: {
  readonly catalogDistr?: string | null;
  readonly crseAttrValueGroups?: readonly RosterAttributeValueGroup[] | null;
}): string | undefined =>
  catalogDistr || getAttributeGroupValues(crseAttrValueGroups, 'Distribution Requirements');
