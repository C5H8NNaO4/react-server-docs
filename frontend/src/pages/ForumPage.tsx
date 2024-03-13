import ForumPage from '@state-less/leap-frontend/dist/forum/index';
import { FORUM_BASE_PATH, FORUM_KEY, FORUM_QA_GH, FORUM_RULES_GH } from '../lib/config';

export default () => {
  return (
    <ForumPage
      basePath={FORUM_BASE_PATH}
      forumKey={FORUM_KEY}
      ghSrc={{
        rules: FORUM_RULES_GH,
        qa: FORUM_QA_GH,
      }}
    />
  );
};
