/**
 * Shared by courses json generator and app, so file must not import anything.
 */

export type RosterAttributeValueGroup = {
  readonly attrDescr: string;
  readonly crseAttrValues: string;
};

/**
 * Starting FA25, the roster API leaves catalogDistr null and reports distributions in
 * crseAttrValueGroups instead. For example, "(SBA-AG), (SSC-AS)".
 * @returns the course's distribution string, or undefined if it has none.
 */
export const getCourseDistributionString = ({
  catalogDistr,
  crseAttrValueGroups,
}: {
  readonly catalogDistr?: string | null;
  readonly crseAttrValueGroups?: readonly RosterAttributeValueGroup[] | null;
}): string | undefined =>
  catalogDistr ||
  crseAttrValueGroups?.find(group => group.attrDescr === 'Distribution Requirements')
    ?.crseAttrValues ||
  undefined;
