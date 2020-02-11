package com.xima.per.config;


import com.xima.per.dao.UserDao;
import com.xima.per.entity.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * @author: Pxn
 * @date: 2019/11/13 22:13
 */
@SpringBootTest
@RunWith(value = SpringRunner.class) //为了测试在spring容器环境下执行
public class MyRedisConfigTest {

    //测试redis是否连接成功
    @Autowired
    StringRedisTemplate stringRedisTemplate;
    @Autowired
    RedisTemplate redisTemplate;
    @Autowired
    UserDao userDao;
    @Autowired
    RedisTemplate<Object, User> userRedisTemplate;

    @Test
    public void testString(){
//        stringRedisTemplate.opsForValue().append("msg","hello");//测试字符串存入缓存中
//        stringRedisTemplate.opsForList().leftPushAll("fruit","apple");//测试数组存入缓存中
//        stringRedisTemplate.opsForList().leftPushAll("fruit","watermelon");
//        String msg = stringRedisTemplate.opsForValue().get("msg");//获取缓存中的数据
//        System.out.println(msg);//打印输出到控制台
        List<User> userList = userDao.findAll();
        for (User u:userList) {
            //改变默认的序列化规则
            userRedisTemplate.opsForValue().set("user01",u);//对象必须实现序列化
        }

    }

}