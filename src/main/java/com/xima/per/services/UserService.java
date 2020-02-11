package com.xima.per.services;

import com.xima.per.entity.User;

import java.util.List;

/**
 * @author: Pxn
 * @date: 2019/11/3 15:55
 */
public interface UserService {


    public User save(User user);

    public void delete(User user);

    public List<User> findAll();

    public User getOne(Integer id);

    public User findById(Integer id);

   // public Page<User> getPageNum(Pageable pageable);

}
