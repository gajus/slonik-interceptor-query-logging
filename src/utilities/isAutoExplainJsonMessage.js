// @flow

export default (noticeMessage: string): boolean => {
  return noticeMessage.trim().startsWith('duration:') && noticeMessage.includes('{');
};
