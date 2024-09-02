import Moment from 'react-moment';
import 'moment-timezone';

const GetSeoulTime = ({
  time,
  long = false,
}: {
  time: string | Date;
  long?: boolean;
}) => {
  if (typeof time !== 'string') {
    time = time.toString();
  }
  return (
    <Moment
      tz="Asia/Seoul"
      format={long ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}>
      {time}
    </Moment>
  );
};

export default GetSeoulTime;
