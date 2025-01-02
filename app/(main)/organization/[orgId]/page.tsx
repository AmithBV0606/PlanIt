const Organization = ({ params }: any) => {
  const { orgId } = params;
  return <div>Organization : {orgId}</div>;
};

export default Organization;