import java.io.IOException;
import java.util.HashSet;

import javax.naming.Context;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;

import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class MusicDatasetAnalysis {

        // =====================================================
        // MAPPER CLASS
        // =====================================================

        public static class MusicMapper
                        extends Mapper<Object, Text, Text, Text> {

                private Text trackId = new Text();

                private Text userShare = new Text();

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

                                        String userId = parts[0];

                                        String track = parts[1];

                                        String shared = parts[2];

                                        trackId.set(track);

                                        userShare.set(
                                                        userId + "," + shared);

                                        context.write(
                                                        trackId,
                                                        userShare);
                                }

                        } catch (Exception e) {

                                // Ignore bad rows

                        }
                }
        }

        // =====================================================
        // REDUCER CLASS
        // =====================================================

        public static class MusicReducer
                        extends Reducer<Text, Text, Text, Text> {

                public void reduce(Text key,
                                Iterable<Text> values,
                                Context context)
                                throws IOException, InterruptedException {

                        HashSet<String> listeners = new HashSet<String>();

                        int totalShares = 0;

                        for (Text val : values) {

                                String[] parts = val.toString().split(",");

                                String userId = parts[0];

                                int shared = Integer.parseInt(parts[1]);

                                listeners.add(userId);

                                totalShares += shared;
                        }

                        String result = "UniqueListeners="
                                        + listeners.size()
                                        + " TotalShares="
                                        + totalShares;

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
                                "Music Dataset Analysis");

                job.setJarByClass(
                                MusicDatasetAnalysis.class);

                job.setMapperClass(
                                MusicMapper.class);

                job.setReducerClass(
                                MusicReducer.class);

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
 * FILE NAME: MusicDatasetAnalysis.java
 * =========================================================
 * 
 * COMMANDS TO RUN:
 * 
 * 1. Convert Excel to CSV
 * Example:
 * music.csv
 * 
 * 2. Start Hadoop
 * start-dfs.sh
 * start-yarn.sh
 * 
 * 3. Compile Program
 * javac -classpath `hadoop classpath` -d . MusicDatasetAnalysis.java
 * 
 * 4. Create Jar
 * jar -cvf music.jar *
 * 
 * 5. Create HDFS Folder
 * hdfs dfs -mkdir /musicinput
 * 
 * 6. Upload CSV
 * hdfs dfs -put music.csv /musicinput
 * 
 * 7. Run Program
 * hadoop jar music.jar MusicDatasetAnalysis /musicinput/music.csv /musicoutput
 * 
 * 8. View Output
 * hdfs dfs -cat /musicoutput/part-r-00000
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
 * TrackId UniqueListeners=__ TotalShares=__
 * =========================================================
 */
