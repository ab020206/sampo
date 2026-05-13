import java.io.*;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;

import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;

import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class WordCount {

    // Mapper
    public static class MyMapper
            extends Mapper<Object, Text, Text, IntWritable> {

        IntWritable one = new IntWritable(1);
        Text word = new Text();

        public void map(Object key, Text value, Context context)
                throws IOException, InterruptedException {

            String[] words = value.toString().split(" ");

            for (String w : words) {
                word.set(w);
                context.write(word, one);
            }
        }
    }

    // Reducer
    public static class MyReducer
            extends Reducer<Text, IntWritable, Text, IntWritable> {

        public void reduce(Text key,
                Iterable<IntWritable> values,
                Context context)
                throws IOException, InterruptedException {

            int sum = 0;

            for (IntWritable v : values) {
                sum += v.get();
            }

            context.write(key, new IntWritable(sum));
        }
    }

    // Main
    public static void main(String[] args) throws Exception {

        Job job = Job.getInstance(new Configuration(), "WordCount");

        job.setJarByClass(WordCount.class);

        job.setMapperClass(MyMapper.class);
        job.setReducerClass(MyReducer.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);

        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}

/*
 * =========================================================
 * FILE NAME: WordCount.java
 * =========================================================
 * 
 * COMMANDS TO RUN:
 * 
 * 1. Create Java File:
 * nano WordCount.java
 * 
 * 2. Compile:
 * javac -classpath `hadoop classpath` -d . WordCount.java
 * 
 * 3. Create Jar:
 * jar -cvf wordcount.jar *
 * 
 * 4. Create HDFS Input Folder:
 * hdfs dfs -mkdir /wordinput
 * 
 * 5. Upload Input File:
 * hdfs dfs -put sample.txt /wordinput
 * 
 * 6. Run Program:
 * hadoop jar wordcount.jar WordCount /wordinput/sample.txt /wordoutput
 * 
 * 7. View Output:
 * hdfs dfs -cat /wordoutput/part-r-00000
 * 
 * 
 * SAMPLE INPUT FILE (sample.txt):
 * --------------------------------
 * hello world
 * hello hadoop
 * big data world
 * 
 * EXPECTED OUTPUT:
 * --------------------------------
 * big 1
 * data 1
 * hadoop 1
 * hello 2
 * world 2
 */
