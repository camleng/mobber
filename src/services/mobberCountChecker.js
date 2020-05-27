import { toast } from 'react-toastify';

const hasEnoughMobbers = (mobbers) => {
    if (mobbers.length < 2) {
        toast.error(
            "You're gonna need at least two mobbers to call this a mob. Add some more!",
            {
                position: toast.POSITION.TOP_RIGHT,
            }
        );
        return false;
    }
    return true;
};

export { hasEnoughMobbers };
