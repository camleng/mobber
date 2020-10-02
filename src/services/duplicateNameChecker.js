const nameAlreadyExistsInMob = async (name, mobId) => {
    const isDuplicateResponse = await fetch(`/mob/${mobId}/is-duplicate/${name}`);
    const isDuplicate = (await isDuplicateResponse.json()).isDuplicate;
    return isDuplicate;
};

export default { nameAlreadyExistsInMob };
