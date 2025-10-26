export const validate = (schema) =>
  async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (e) {
      return res.status(400).json({
        errors: e.inner?.length ? e.inner.map((d) => d.message) : [e.message],
      });
    }
  };
