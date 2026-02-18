/* validate group email is to check if there are any missing  emails in beneficiaries group and stakeholders group before adding any  data 
   for the communication type email
  */

export const validateGroupEmails = ({
  group,
  type,
  extractEmail,
  form,
}: {
  group: any;
  type: 'stakeholders' | 'beneficiaries';
  extractEmail: (item: any) => string | undefined;
  form: any;
}) => {
  if (group && Array.isArray(group)) {
    const hasValidEmail = group.some((item) => {
      const email = extractEmail(item);
      return email?.trim() !== '';
    });

    if (!hasValidEmail) {
      form.setError('groupId', {
        type: 'manual',
        message: `Email address is missing for some ${
          type === 'stakeholders' ? 'stakeholders' : 'beneficiaries'
        } in this group.`,
      });

      return false;
    } else {
      form.clearErrors('groupId');
      return true;
    }
  }
  return false;
};
