/* eslint-disable no-unused-vars */
function createBaseController(
  modelMaster: any,
  modelValidation: any,
  options: any
) {
  const { configGetAll, confitGetOne } = options || {};

  async function getAll({ req, ResponseError }: any) {
    const data = await modelMaster.findAll();

    const totalRow = await modelMaster.count();

    return { data, totalRow };
  }

  async function getOne({ req, ResponseError }: any) {
    const { params } = req;
    const data = await modelMaster.findByPk(params.id);

    if (!data) {
      throw new ResponseError({
        message: 'Data tidak ditemukan atau sudah terhapus!',
      });
    }

    return { data };
  }

  async function create({ req, ResponseError }: any) {
    const { body } = req;
    const rawFormData = { ...body };
    const data = await modelMaster.create(rawFormData);

    return { data, message: 'Data berhasil ditambahkan!' };
  }

  async function update({ req, ResponseError }: any) {
    const { body, params } = req;
    const rawFormData = { ...body };
    const data = await modelMaster.findByPk(params.id);

    if (!data) {
      throw new ResponseError({
        message: 'Data tidak ditemukan atau sudah terhapus!',
      });
    }

    await data.update(rawFormData);
    return { data, message: 'Data sudah diperbarui!' };
  }

  async function destroy({ req, ResponseError }: any) {
    const { params } = req;
    const data = await modelMaster.findByPk(params.id);

    if (!data) {
      throw new ResponseError({
        message: 'Data tidak ditemukan atau sudah terhapus!',
      });
    }

    await data.destroy();
    return { message: 'Data berhasil dihapus!' };
  }

  return { getAll, getOne, create, update, destroy };
}

export default createBaseController;
