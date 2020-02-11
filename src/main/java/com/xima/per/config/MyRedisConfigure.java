package com.xima.per.config;

import com.xima.per.entity.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

import java.net.UnknownHostException;

/**
 * @author: Pxn
 * @date: 2019/11/13 21:22
 */
@Configuration
public class MyRedisConfigure  {


    @Bean
    public RedisTemplate<Object, User> userRedisTemplate(RedisConnectionFactory redisConnectionFactory)
            throws UnknownHostException {
        RedisTemplate<Object, User> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        //改变默认的序列化规则
        Jackson2JsonRedisSerializer<User> ser = new Jackson2JsonRedisSerializer<User>(User.class);
        template.setDefaultSerializer(ser);
        return template;
    }

    /*@Bean
    public RedisCacheManager userRedisCacheManager(RedisTemplate<Object, User> userRedisTemplate){
        RedisCacheManager cacheManager = new RedisCacheManager();
        cacheManager.set
        return cacheManager;
    }
*/

}
