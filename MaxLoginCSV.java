import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class MaxLoginCSV {

    // =====================================================
    // MAPPER
    // =====================================================

    public static class LoginMapper
            extends org.apache.hadoop.mapreduce.Mapper<Object, Text, Text, LongWritable> {

        private Text user = new Text();
        private LongWritable durationWritable = new LongWritable();

        public void map(Object key,
                Text value,
                Context context)
                throws IOException, InterruptedException {

            try {

                String line = value.toString();

                String[] parts = line.split(",");

                // Skip invalid rows
                if (parts.length < 8)
                    return;

                String macAddress = parts[0];

                String loginTime = parts[5];

                String logoutTime = parts[7];

                SimpleDateFormat sdf = new SimpleDateFormat("M/d/yyyy H:mm");

                Date login = sdf.parse(loginTime);

                Date logout = sdf.parse(logoutTime);

                long duration = (logout.getTime() - login.getTime())
                        / (1000 * 60);

                user.set(macAddress);

                durationWritable.set(duration);

                context.write(user, durationWritable);

            } catch (Exception e) {

                // Ignore bad records

            }
        }
    }

    // =====================================================
    // REDUCER
    // =====================================================

    public static class LoginReducer
            extends org.apache.hadoop.mapreduce.Reducer<Text, LongWritable, Text, LongWritable> {

        long maxDuration = 0;

        Text maxUser = new Text();

        public void reduce(Text key,
                Iterable<LongWritable> values,
                Context context)
                throws IOException, InterruptedException {

            long total = 0;

            for (LongWritable val : values) {

                total += val.get();
            }

            if (total > maxDuration) {

                maxDuration = total;

                maxUser.set(key);
            }
        }

        @Override
        protected void cleanup(Context context)
                throws IOException, InterruptedException {

            context.write(
                    maxUser,
                    new LongWritable(maxDuration));
        }
    }

    // =====================================================
    // DRIVER
    // =====================================================

    public static void main(String[] args)
            throws Exception {

        Configuration conf = new Configuration();

        Job job = Job.getInstance(
                conf,
                "Maximum Login Time CSV");

        job.setJarByClass(MaxLoginCSV.class);

        job.setMapperClass(LoginMapper.class);

        job.setReducerClass(LoginReducer.class);

        job.setOutputKeyClass(Text.class);

        job.setOutputValueClass(LongWritable.class);

        FileInputFormat.addInputPath(
                job,
                new Path(args[0]));

        FileOutputFormat.setOutputPath(
                job,
                new Path(args[1]));

        System.exit(
                job.waitForCompletion(true)
                        ? 0
                        : 1);
    }
}

/*
 * =========================================================
 * FILE NAME: MaxLoginCSV.java
 * =========================================================
 * 
 * COMMANDS TO RUN:
 * 
 * 1. Start Hadoop
 * start-dfs.sh
 * start-yarn.sh
 * 
 * 2. Compile
 * javac -classpath `hadoop classpath` -d . MaxLoginCSV.java
 * 
 * 3. Create Jar
 * jar -cvf maxlogincsv.jar *
 * 
 * 4. Create HDFS Input Folder
 * hdfs dfs -mkdir /input
 * 
 * 5. Upload CSV File
 * hdfs dfs -put logTime22.csv /input
 * 
 * 6. Run Program
 * hadoop jar maxlogincsv.jar MaxLoginCSV /input/logTime22.csv /output_login
 * 
 * 7. View Output
 * hdfs dfs -cat /output_login/part-r-00000
 */
