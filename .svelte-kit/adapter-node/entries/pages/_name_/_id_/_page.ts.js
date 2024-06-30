const load = async ({ params }) => {
  return {
    dataName: params.name,
    rowId: params.id
  };
};
export {
  load
};
