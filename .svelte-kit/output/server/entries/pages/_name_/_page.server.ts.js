const load = async ({ request, params }) => {
  const email = request.headers.get("X-Goog-Authenticated-User-Email");
  const token = request.headers.get("x-goog-iap-jwt-assertion");
  return {
    userEmail: email,
    userToken: token,
    dataName: params.name
  };
};
export {
  load
};
