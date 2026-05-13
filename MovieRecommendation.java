import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;

import org.apache.hadoop.io.FloatWritable;
import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class MovieRecommendation {

        // =====================================================
        // MAPPER CLASS
        // =====================================================

        public static class MovieMapper
                        extends Mapper<Object, Text, Text, FloatWritable> {

                private Text movieId = new Text();

                private FloatWritable rating = new FloatWritable();

                public void map(Object key,
                                Text value,
                                Context context)
                                throws IOException, InterruptedException {

                        try {

                                String line = value.toString().trim();

                                String[] parts = line.split(",");

                                // Skip header

                                if (parts[0].equalsIgnoreCase("userId"))
                                        return;

                                // Check valid row

                                if (parts.length == 4) {

                                        String movie = parts[1];

                                        float rate = Float.parseFloat(parts[2]);

                                        movieId.set(movie);

                                        rating.set(rate);

                                        context.write(
                                                        movieId,
                                                        rating);
                                }

                        } catch (Exception e) {

                                // Ignore bad rows

                        }
                }
        }

        // =====================================================
        // REDUCER CLASS
        // =====================================================

        public static class MovieReducer
                        extends Reducer<Text, FloatWritable, Text, Text> {

                public void reduce(Text key,
                                Iterable<FloatWritable> values,
                                Context context)
                                throws IOException, InterruptedException {

                        float total = 0;

                        int count = 0;

                        for (FloatWritable val : values) {

                                total += val.get();

                                count++;
                        }

                        float average = total / count;

                        String result = "AverageRating="
                                        + average;

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
                                "Movie Recommendation");

                job.setJarByClass(
                                MovieRecommendation.class);

                job.setMapperClass(
                                MovieMapper.class);

                job.setReducerClass(
                                MovieReducer.class);

                job.setOutputKeyClass(
                                Text.class);

                job.setOutputValueClass(
                                FloatWritable.class);

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
 * FILE NAME: MovieRecommendation.java
 * =========================================================
 * 
 * COMMANDS TO RUN:
 * 
 * 1. Start Hadoop
 * start-dfs.sh
 * start-yarn.sh
 * 
 * 2. Compile Program
 * javac -classpath `hadoop classpath` -d . MovieRecommendation.java
 * 
 * 3. Create Jar File
 * jar -cvf movie.jar *
 * 
 * 4. Create HDFS Folder
 * hdfs dfs -mkdir /movieinput
 * 
 * 5. Upload CSV File
 * hdfs dfs -put ratings_small.csv /movieinput
 * 
 * 6. Run Program
 * hadoop jar movie.jar MovieRecommendation /movieinput/ratings_small.csv
 * /movieoutput
 * 
 * 7. View Output
 * hdfs dfs -cat /movieoutput/part-r-00000
 * 
 * 
 * =========================================================
 * DATASET FORMAT
 * =========================================================
 * 
 * userId,movieId,rating,timestamp
 * 
 * Example:
 * 1,31,2.5,1260759144
 * 1,1029,3.0,1260759179
 * 
 * OUTPUT:
 * movieId AverageRating=__
 * =========================================================
 */
