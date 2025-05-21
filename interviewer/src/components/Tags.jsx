import { Tag, Typography } from 'antd';

const Tags = ({ tags }) => {
  return (
    <>
      {tags.map((tag, index) => (
        // <Tag key={`${tag}-${index}`}>{tag}</Tag>
        <Typography.Text key={`${tag}-${index}`} keyboard>
          {tag}
        </Typography.Text>
      ))}
    </>
  );
};
export default Tags;
