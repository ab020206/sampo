import java.io.IOException;

import javax.naming.Context;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;

import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class RadioSkipAnalysis {

        // =====================================================
        // MAPPER CLASS
        // =====================================================

        public static class RadioMapper
                        extends Mapper<Object, Text, Text, Text> {

                private Text trackId = new Text();

                private Text radioSkip = new Text();

                public void map(Object key,
                                Text value,
                                Context context)
                                throws IOException, InterruptedException {

                        try {

                                String line = value.toString().trim();

                                String[] parts = line.split(",");

                                // Skip header

                                if (parts[0].equalsIgnoreCase("UserId"))
                                        return;

                                // Check valid row

                                if (parts.length == 5) {

                                        String track = parts[1];

                                        String radio = parts[3];

                                        String skip = parts[4];

                                        trackId.set(track);

                                        radioSkip.set(
                                                        radio + "," + skip);

                                        context.write(
                                                        trackId,
                                                        radioSkip);
                                }

                        } catch (Exception e) {

                                // Ignore bad rows

                        }
                }
        }

        // =====================================================
        // REDUCER CLASS
        // =====================================================

        public static class RadioReducer
                        extends Reducer<Text, Text, Text, Text> {

                public void reduce(Text key,
                                Iterable<Text> values,
                                Context context)
                                throws IOException, InterruptedException {

                        int totalRadio = 0;

                        int totalSkip = 0;

                        for (Text val : values) {

                                String[] parts = val.toString().split(",");

                                int radio = Integer.parseInt(parts[0]);

                                int skip = Integer.parseInt(parts[1]);

                                totalRadio += radio;

                                totalSkip += skip;
                        }

                        String result = "RadioPlays="
                                        + totalRadio
                                        + " Skips="
                                        + totalSkip;

                        context.write(
                                        key,
                                        new Text(result));
                }
        }

        // =====================================================
        // DRIVER CLASS
        // =====================================================

        public static void main(String[] args)
                        throws Exception {

                Configuration conf = new Configuration();

                Job job = Job.getInstance(
                                conf,
                                "Radio Skip Analysis");

                job.setJarByClass(
                                RadioSkipAnalysis.class);

                job.setMapperClass(
                                RadioMapper.class);

                job.setReducerClass(
                                RadioReducer.class);

                job.setMapOutputKeyClass(
                                Text.class);

                job.setMapOutputValueClass(
                                Text.class);

                job.setOutputKeyClass(
                                Text.class);

                job.setOutputValueClass(
                                Text.class);

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
 * FILE NAME: RadioSkipAnalysis.java
 * =========================================================
 * 
 * COMMANDS TO RUN:
 * 
 * 1. Convert Excel file to CSV
 * Example:
 * music.csv
 * 
 * 2. Start Hadoop
 * start-dfs.sh
 * start-yarn.sh
 * 
 * 3. Compile Program
 * javac -classpath `hadoop classpath` -d . RadioSkipAnalysis.java
 * 
 * 4. Create Jar File
 * jar -cvf radio.jar *
 * 
 * 5. Create HDFS Folder
 * hdfs dfs -mkdir /musicinput
 * 
 * 6. Upload CSV File
 * hdfs dfs -put music.csv /musicinput
 * 
 * 7. Run Program
 * hadoop jar radio.jar RadioSkipAnalysis /musicinput/music.csv /radiooutput
 * 
 * 8. View Output
 * hdfs dfs -cat /radiooutput/part-r-00000
 * 
 * 
 * =========================================================
 * DATASET FORMAT
 * =========================================================
 * 
 * UserId,TrackId,Shared,Radio,Skip
 * 
 * Example:
 * 111115,222,0,1,0
 * 111113,225,1,0,0
 * 111117,223,0,1,1
 * 
 * OUTPUT:
 * TrackId RadioPlays=__ Skips=__
 * =========================================================
 */
